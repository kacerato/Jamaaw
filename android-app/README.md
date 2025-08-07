# Mocha Android App

Este é o aplicativo Android oficial para o site **Mocha** (https://v2mahcy4mgu2u.mocha.app). O aplicativo foi desenvolvido para fornecer uma experiência mobile nativa que mantém todas as funcionalidades e o design visual do website original.

## 📱 Características

- **Interface WebView**: Carrega o site completo de forma nativa
- **Design Material 3**: Interface moderna seguindo as diretrizes do Google
- **Tema Mocha**: Paleta de cores inspirada em café com modo escuro
- **Navegação Nativa**: Bottom navigation com telas Home, Configurações e Sobre
- **Otimizado para Performance**: Carregamento rápido e navegação fluida
- **Offline Ready**: Handling de erros e estados de carregamento
- **Compartilhamento**: Funcionalidade para compartilhar o app
- **Splash Screen**: Tela de inicialização com animação

## 🏗️ Arquitetura

- **Linguagem**: Kotlin 100%
- **UI Framework**: Jetpack Compose
- **Arquitetura**: MVVM com Navigation Component
- **Tema**: Material Design 3
- **WebView**: Android WebKit para carregamento do site
- **Minimum SDK**: Android 7.0 (API 24)
- **Target SDK**: Android 14 (API 34)

## 🎨 Design

O aplicativo utiliza uma paleta de cores inspirada em café:

- **Primary**: Saddle Brown (#8B4513)
- **Secondary**: Chocolate (#D2691E) 
- **Background**: Cornsilk (#FFF8DC)
- **Accent**: Peru (#CD853F)
- **Dark Theme**: Cores adaptadas para modo escuro

## 🚀 Como Compilar

### Pré-requisitos

- Android Studio Arctic Fox ou superior
- JDK 8 ou superior
- Android SDK com API 34
- Dispositivo Android ou emulador com API 24+

### Passos para Compilação

1. **Clone ou baixe o projeto**:
   ```bash
   # Se usando Git
   git clone [repository-url]
   cd mocha-android-app
   ```

2. **Abra no Android Studio**:
   - Abra o Android Studio
   - Selecione "Open an existing project"
   - Navegue até a pasta `android-app`
   - Aguarde a sincronização do Gradle

3. **Configure o SDK** (se necessário):
   - Vá em File > Project Structure
   - Verifique se o SDK está configurado corretamente

4. **Execute o aplicativo**:
   - Conecte um dispositivo Android ou inicie um emulador
   - Clique em "Run" (▶️) ou pressione Shift+F10
   - Selecione o dispositivo de destino

### Build de Release

Para criar um APK de release:

```bash
# Na pasta do projeto
./gradlew assembleRelease
```

O APK será gerado em `app/build/outputs/apk/release/`

## 📂 Estrutura do Projeto

```
android-app/
├── app/
│   ├── src/main/
│   │   ├── java/com/mocha/app/
│   │   │   ├── MainActivity.kt              # Atividade principal
│   │   │   └── ui/
│   │   │       ├── theme/                   # Tema e cores
│   │   │       ├── screens/                 # Telas do app
│   │   │       │   ├── HomeScreen.kt       # Tela principal com WebView
│   │   │       │   ├── SettingsScreen.kt   # Tela de configurações
│   │   │       │   └── AboutScreen.kt      # Tela sobre o app
│   │   │       └── components/              # Componentes reutilizáveis
│   │   │           └── WebViewComponent.kt  # Componente WebView
│   │   ├── res/
│   │   │   ├── values/                      # Strings, cores, temas
│   │   │   ├── drawable/                    # Ícones e recursos visuais
│   │   │   └── mipmap/                      # Ícones do launcher
│   │   └── AndroidManifest.xml             # Configurações do app
│   ├── build.gradle                        # Dependências do módulo
│   └── proguard-rules.pro                  # Regras de ofuscação
├── build.gradle                            # Configuração global
├── settings.gradle                         # Configurações do projeto
└── gradle.properties                       # Propriedades do Gradle
```

## 🛠️ Funcionalidades Implementadas

### Tela Principal (Home)
- WebView otimizado com o site completo
- Loading indicator durante carregamento
- Handling de erros de conexão
- Botão de refresh na toolbar
- Botão de compartilhamento

### Tela de Configurações
- Alternar entre tema claro/escuro
- Configurações de notificações
- Gerenciamento de cache
- Informações sobre o app

### Tela Sobre
- Informações sobre o aplicativo
- Lista de recursos
- Link para o website
- Informações de versão

### Componentes Técnicos
- **WebView Security**: Configurações seguras de WebView
- **Material Theme**: Tema adaptável claro/escuro
- **Navigation**: Sistema de navegação com bottom tabs
- **Error Handling**: Tratamento de erros de rede
- **Splash Screen**: Tela de inicialização nativa

## 🌐 Integração com o Website

O aplicativo carrega o website original (`https://v2mahcy4mgu2u.mocha.app`) através de um WebView otimizado com:

- JavaScript habilitado
- DOM Storage habilitado
- User Agent personalizado
- Cache configurado
- Zoom controls desabilitados
- File access restrito por segurança

## 🔧 Personalizações Possíveis

### Alterar URL do Website
Edite o arquivo `app/src/main/res/values/strings.xml`:
```xml
<string name="website_url">https://seu-novo-site.com</string>
```

### Modificar Cores do Tema
Edite o arquivo `app/src/main/res/values/colors.xml` com suas cores preferidas.

### Adicionar Novas Funcionalidades
- Adicione novas telas em `ui/screens/`
- Crie novos componentes em `ui/components/`
- Registre navegação em `MainActivity.kt`

## 📱 Compatibilidade

- **Android**: 7.0+ (API 24+)
- **Arquiteturas**: ARM64, ARM32, x86, x86_64
- **Tamanho do APK**: ~15-20 MB
- **Permissões**: Internet, Network State, WiFi State

## 🔒 Segurança

- WebView configurado com restrições de segurança
- Permissões mínimas necessárias
- ProGuard habilitado para release builds
- File access restrito
- HTTPS enforced

## 🐛 Resolução de Problemas

### Problemas Comuns

**Erro de compilação**: 
- Verifique se o Android SDK está instalado
- Confirme que o JDK 8+ está configurado
- Execute "Clean Project" no Android Studio

**App não carrega o site**:
- Verifique a conexão com internet
- Confirme se a URL está correta em strings.xml
- Teste a URL em um navegador web

**Problemas de layout**:
- Teste em diferentes tamanhos de tela
- Verifique se os recursos estão no lugar correto

## 📄 Licença

Este projeto foi criado como um aplicativo cliente para o website Mocha e mantém compatibilidade total com suas funcionalidades originais.

## 📞 Suporte

Para problemas relacionados ao aplicativo Android, verifique:
1. As configurações do projeto no Android Studio
2. Se todas as dependências foram baixadas
3. Se o dispositivo/emulador é compatível
4. Se a internet está funcionando

---

**Desenvolvido com ❤️ em Kotlin + Jetpack Compose**