#!/bin/bash

echo "🚀 Compilando Mocha Android App..."
echo "=================================="

# Verificar se o Gradle Wrapper existe
if [ ! -f "./gradlew" ]; then
    echo "❌ Gradle Wrapper não encontrado!"
    echo "   Por favor, abra o projeto no Android Studio primeiro"
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
./gradlew clean

# Compilar APK de release
echo "📱 Compilando APK de release..."
./gradlew assembleRelease

# Verificar se a compilação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Compilação concluída com sucesso!"
    echo ""
    echo "📁 APK gerado em:"
    echo "   app/build/outputs/apk/release/app-release.apk"
    echo ""
    echo "📋 Para instalar no celular:"
    echo "   1. Ative 'Fontes desconhecidas' nas configurações"
    echo "   2. Transfira o APK para o celular"
    echo "   3. Toque no arquivo para instalar"
    echo ""
    echo "🎉 Seu app Mocha está pronto!"
else
    echo ""
    echo "❌ Erro na compilação!"
    echo "   Verifique se o Android SDK está instalado"
    echo "   E se o projeto foi aberto no Android Studio"
fi