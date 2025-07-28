import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
  getCurrentUser,
} from "@getmocha/users-service/backend";
import {
  CreateStreetRequestSchema,
  UpdateStreetRequestSchema,
  CreateSuggestionRequestSchema,
  ReviewSuggestionRequestSchema,
} from "../shared/types";
import z from "zod";

const app = new Hono<{ Bindings: Env }>();

// CORS configuration
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://*.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Authentication endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  try {
    const redirectUrl = await getOAuthRedirectUrl('google', {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
    return c.json({ redirectUrl }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to get redirect URL' }, 500);
  }
});

app.post("/api/sessions", zValidator("json", z.object({ code: z.string() })), async (c) => {
  try {
    const { code } = c.req.valid("json");
    
    const sessionToken = await exchangeCodeForSessionToken(code, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: 60 * 24 * 60 * 60, // 60 days
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to exchange code' }, 500);
  }
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    try {
      await deleteSession(sessionToken, {
        apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
        apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
      });
    } catch (error) {
      // Ignore deletion errors
    }
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Admin middleware
const adminMiddleware = async (c: any, next: any) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Check if user is admin by user_id or email
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM admin_users WHERE (user_id = ? OR email = ?) AND is_active = TRUE"
  ).bind(user.id, user.email).all();

  if (!results || results.length === 0) {
    return c.json({ error: 'Admin access required' }, 403);
  }

  await next();
};

// Public endpoints - Streets (read-only)
app.get('/api/streets', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM streets ORDER BY created_at DESC"
    ).all();
    
    return c.json(results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch streets' }, 500);
  }
});

app.get('/api/streets/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM streets WHERE id = ?"
    ).bind(id).all();
    
    if (!results || results.length === 0) {
      return c.json({ error: 'Street not found' }, 404);
    }
    
    return c.json(results[0]);
  } catch (error) {
    return c.json({ error: 'Failed to fetch street' }, 500);
  }
});

// Public endpoint - Submit suggestion
app.post('/api/suggestions', zValidator("json", CreateSuggestionRequestSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    
    const { results } = await c.env.DB.prepare(
      `INSERT INTO street_suggestions (street_name, neighborhood, description, suggested_by_name, suggested_by_email, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
       RETURNING *`
    ).bind(
      data.street_name,
      data.neighborhood || null,
      data.description || null,
      data.suggested_by_name || null,
      data.suggested_by_email || null
    ).all();
    
    return c.json(results[0], 201);
  } catch (error) {
    return c.json({ error: 'Failed to create suggestion' }, 500);
  }
});

// Admin endpoints - Protected
app.post('/api/admin/streets', authMiddleware, adminMiddleware, zValidator("json", CreateStreetRequestSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    
    const { results } = await c.env.DB.prepare(
      `INSERT INTO streets (name, neighborhood, latitude, longitude, status, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
       RETURNING *`
    ).bind(
      data.name,
      data.neighborhood || null,
      data.latitude || null,
      data.longitude || null,
      data.status || 'planned',
      data.notes || null
    ).all();
    
    return c.json(results[0], 201);
  } catch (error) {
    return c.json({ error: 'Failed to create street' }, 500);
  }
});

app.put('/api/admin/streets/:id', authMiddleware, adminMiddleware, zValidator("json", UpdateStreetRequestSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid("json");
    
    let query = "UPDATE streets SET updated_at = datetime('now')";
    const params: any[] = [];
    
    if (data.status !== undefined) {
      query += ", status = ?";
      params.push(data.status);
      
      // Set timestamps based on status
      if (data.status === 'in_progress' && !data.started_at) {
        query += ", started_at = datetime('now')";
      } else if (data.status === 'completed' && !data.completed_at) {
        query += ", completed_at = datetime('now')";
      }
    }
    
    if (data.notes !== undefined) {
      query += ", notes = ?";
      params.push(data.notes);
    }
    
    if (data.started_at !== undefined) {
      query += ", started_at = ?";
      params.push(data.started_at);
    }
    
    if (data.completed_at !== undefined) {
      query += ", completed_at = ?";
      params.push(data.completed_at);
    }
    
    query += " WHERE id = ? RETURNING *";
    params.push(id);
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all();
    
    if (!results || results.length === 0) {
      return c.json({ error: 'Street not found' }, 404);
    }
    
    return c.json(results[0]);
  } catch (error) {
    return c.json({ error: 'Failed to update street' }, 500);
  }
});

app.delete('/api/admin/streets/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await c.env.DB.prepare(
      "DELETE FROM streets WHERE id = ?"
    ).bind(id).run();
    
    if (result.changes === 0) {
      return c.json({ error: 'Street not found' }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete street' }, 500);
  }
});

// Admin suggestions management
app.get('/api/admin/suggestions', authMiddleware, adminMiddleware, async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM street_suggestions ORDER BY created_at DESC"
    ).all();
    
    return c.json(results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch suggestions' }, 500);
  }
});

app.put('/api/admin/suggestions/:id/review', authMiddleware, adminMiddleware, zValidator("json", ReviewSuggestionRequestSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid("json");
    
    const { results } = await c.env.DB.prepare(
      `UPDATE street_suggestions 
       SET is_reviewed = TRUE, is_approved = ?, admin_notes = ?, reviewed_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ?
       RETURNING *`
    ).bind(data.is_approved, data.admin_notes || null, id).all();
    
    if (!results || results.length === 0) {
      return c.json({ error: 'Suggestion not found' }, 404);
    }
    
    // If approved, optionally create the street automatically
    if (data.is_approved) {
      const suggestion = results[0] as any;
      await c.env.DB.prepare(
        `INSERT INTO streets (name, neighborhood, status, notes, created_at, updated_at)
         VALUES (?, ?, 'planned', ?, datetime('now'), datetime('now'))`
      ).bind(
        suggestion.street_name,
        suggestion.neighborhood,
        `Criada a partir de sugestão: ${suggestion.description || ''}`
      ).run();
    }
    
    return c.json(results[0]);
  } catch (error) {
    return c.json({ error: 'Failed to review suggestion' }, 500);
  }
});

// Admin user management
app.post('/api/admin/users', authMiddleware, adminMiddleware, zValidator("json", z.object({ email: z.string().email() })), async (c) => {
  try {
    const { email } = c.req.valid("json");
    
    // Get user info from Users Service
    const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);
    if (!sessionToken) {
      return c.json({ error: 'No session token' }, 401);
    }
    
    const user = await getCurrentUser(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
    
    if (!user || user.email !== email) {
      return c.json({ error: 'User not found or email mismatch' }, 404);
    }
    
    const { results } = await c.env.DB.prepare(
      `INSERT OR REPLACE INTO admin_users (user_id, email, created_at, updated_at)
       VALUES (?, ?, datetime('now'), datetime('now'))
       RETURNING *`
    ).bind(user.id, email).all();
    
    return c.json(results[0], 201);
  } catch (error) {
    return c.json({ error: 'Failed to add admin user' }, 500);
  }
});

// Photo management endpoints
app.get('/api/admin/photos/:streetId', authMiddleware, adminMiddleware, async (c) => {
  try {
    const streetId = c.req.param('streetId');
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM street_photos WHERE street_id = ? ORDER BY created_at DESC"
    ).bind(streetId).all();
    
    return c.json(results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch photos' }, 500);
  }
});

app.post('/api/admin/photos', authMiddleware, adminMiddleware, async (c) => {
  try {
    // In a real implementation, you would handle file upload to cloud storage
    // For now, return a simulated response
    return c.json({ 
      message: 'Photo upload endpoint - implement with cloud storage',
      note: 'This endpoint needs to be connected to a cloud storage service like Cloudflare Images or AWS S3'
    }, 501);
  } catch (error) {
    return c.json({ error: 'Failed to upload photo' }, 500);
  }
});

app.delete('/api/admin/photos/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await c.env.DB.prepare(
      "DELETE FROM street_photos WHERE id = ?"
    ).bind(id).run();
    
    if (result.changes === 0) {
      return c.json({ error: 'Photo not found' }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete photo' }, 500);
  }
});

// Get Google Maps API key (for frontend)
app.get('/api/maps/key', async (c) => {
  return c.json({ apiKey: c.env.GOOGLE_MAPS_API_KEY });
});

export default app;
