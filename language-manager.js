#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Sistema de gerenciamento de idiomas
class LanguageManager {
    constructor() {
        this.currentLanguage = 'pt-BR';
        this.defaultLanguage = 'pt-BR';
        this.supportedLanguages = {
            'pt-BR': 'Português (Brasil)',
            'en-US': 'English',
            'es-ES': 'Español',
            'fr-FR': 'Français',
            'de-DE': 'Deutsch',
            'it-IT': 'Italiano'
        };
        this.translations = this.loadTranslations();
    }

    // Carregar traduções
    loadTranslations() {
        const translations = {
            'pt-BR': {
                app_title: 'HoliverQRCode',
                loading: 'Carregando...',
                generating: 'Gerando QR Code...',
                success: 'QR Code gerado com sucesso!',
                error: 'Erro ao gerar QR Code',
                save: 'Salvar',
                copy: 'Copiar',
                clear: 'Limpar',
                settings: 'Configurações',
                about: 'Sobre',
                version: 'Versão',
                author: 'Autor',
                exit: 'Sair',
                language: 'Idioma',
                select_language: 'Selecionar Idioma',
                qr_code: 'QR Code',
                text: 'Texto',
                url: 'URL',
                phone: 'Telefone',
                email: 'E-mail',
                wifi: 'Wi-Fi',
                location: 'Localização',
                contact: 'Contato',
                calendar: 'Calendário',
                sms: 'SMS'
            },
            'en-US': {
                app_title: 'HoliverQRCode',
                loading: 'Loading...',
                generating: 'Generating QR Code...',
                success: 'QR Code generated successfully!',
                error: 'Error generating QR Code',
                save: 'Save',
                copy: 'Copy',
                clear: 'Clear',
                settings: 'Settings',
                about: 'About',
                version: 'Version',
                author: 'Author',
                exit: 'Exit',
                language: 'Language',
                select_language: 'Select Language',
                qr_code: 'QR Code',
                text: 'Text',
                url: 'URL',
                phone: 'Phone',
                email: 'E-mail',
                wifi: 'Wi-Fi',
                location: 'Location',
                contact: 'Contact',
                calendar: 'Calendar',
                sms: 'SMS'
            },
            'es-ES': {
                app_title: 'HoliverQRCode',
                loading: 'Cargando...',
                generating: 'Generando QR Code...',
                success: '¡QR Code generado con éxito!',
                error: 'Error al generar QR Code',
                save: 'Guardar',
                copy: 'Copiar',
                clear: 'Limpiar',
                settings: 'Configuración',
                about: 'Acerca de',
                version: 'Versión',
                author: 'Autor',
                exit: 'Salir',
                language: 'Idioma',
                select_language: 'Seleccionar Idioma',
                qr_code: 'QR Code',
                text: 'Texto',
                url: 'URL',
                phone: 'Teléfono',
                email: 'Correo electrónico',
                wifi: 'Wi-Fi',
                location: 'Ubicación',
                contact: 'Contacto',
                calendar: 'Calendario',
                sms: 'SMS'
            },
            'fr-FR': {
                app_title: 'HoliverQRCode',
                loading: 'Chargement...',
                generating: 'Génération du QR Code...',
                success: 'QR Code généré avec succès!',
                error: 'Erreur lors de la génération du QR Code',
                save: 'Enregistrer',
                copy: 'Copier',
                clear: 'Effacer',
                settings: 'Paramètres',
                about: 'À propos',
                version: 'Version',
                author: 'Auteur',
                exit: 'Quitter',
                language: 'Langue',
                select_language: 'Sélectionner la langue',
                qr_code: 'QR Code',
                text: 'Texte',
                url: 'URL',
                phone: 'Téléphone',
                email: 'E-mail',
                wifi: 'Wi-Fi',
                location: 'Localisation',
                contact: 'Contact',
                calendar: 'Calendrier',
                sms: 'SMS'
            },
            'de-DE': {
                app_title: 'HoliverQRCode',
                loading: 'Laden...',
                generating: 'QR Code generieren...',
                success: 'QR Code erfolgreich generiert!',
                error: 'Fehler beim Generieren des QR Codes',
                save: 'Speichern',
                copy: 'Kopieren',
                clear: 'Löschen',
                settings: 'Einstellungen',
                about: 'Über',
                version: 'Version',
                author: 'Autor',
                exit: 'Beenden',
                language: 'Sprache',
                select_language: 'Sprache auswählen',
                qr_code: 'QR Code',
                text: 'Text',
                url: 'URL',
                phone: 'Telefon',
                email: 'E-Mail',
                wifi: 'Wi-Fi',
                location: 'Standort',
                contact: 'Kontakt',
                calendar: 'Kalender',
                sms: 'SMS'
            },
            'it-IT': {
                app_title: 'HoliverQRCode',
                loading: 'Caricamento...',
                generating: 'Generazione QR Code...',
                success: 'QR Code generato con successo!',
                error: 'Errore nella generazione del QR Code',
                save: 'Salva',
                copy: 'Copia',
                clear: 'Cancella',
                settings: 'Impostazioni',
                about: 'Informazioni',
                version: 'Versione',
                author: 'Autore',
                exit: 'Esci',
                language: 'Lingua',
                select_language: 'Seleziona lingua',
                qr_code: 'QR Code',
                text: 'Testo',
                url: 'URL',
                phone: 'Telefono',
                email: 'E-mail',
                wifi: 'Wi-Fi',
                location: 'Posizione',
                contact: 'Contatto',
                calendar: 'Calendario',
                sms: 'SMS'
            }
        };
        return translations;
    }

    // Obter idioma do instalador NSIS
    getInstallerLanguage() {
        try {
            // Tentar ler o idioma do registro do Windows
            const { execSync } = require('child_process');

            if (process.platform === 'win32') {
                try {
                    const regQuery = execSync('reg query "HKLM\\Software\\HoliverQRCode" /v Language', { encoding: 'cp850' });
                    const match = regQuery.match(/Language\s+REG_SZ\s+(.+)/);
                    if (match && match[1]) {
                        const langCode = this.normalizeLanguageCode(match[1].trim());
                        console.log(`🌍 Idioma detectado do instalador: ${langCode}`);
                        return langCode;
                    }
                } catch (error) {
                    console.log('📝 Idioma do instalador não encontrado, usando sistema');
                }
            }

            // Fallback para idioma do sistema
            const systemLang = app.getLocale();
            return this.normalizeLanguageCode(systemLang);

        } catch (error) {
            console.log('❌ Erro ao detectar idioma, usando padrão');
            return this.defaultLanguage;
        }
    }

    // Normalizar código de idioma
    normalizeLanguageCode(langCode) {
        const langMap = {
            'pt': 'pt-BR',
            'pt-BR': 'pt-BR',
            'pt-PT': 'pt-BR',
            'en': 'en-US',
            'en-US': 'en-US',
            'en-GB': 'en-US',
            'es': 'es-ES',
            'es-ES': 'es-ES',
            'fr': 'fr-FR',
            'fr-FR': 'fr-FR',
            'de': 'de-DE',
            'de-DE': 'de-DE',
            'it': 'it-IT',
            'it-IT': 'it-IT'
        };

        return langMap[langCode] || this.defaultLanguage;
    }

    // Inicializar idioma
    initialize() {
        this.currentLanguage = this.getInstallerLanguage();
        console.log(`🌍 Idioma inicializado: ${this.currentLanguage} (${this.supportedLanguages[this.currentLanguage]})`);

        // Salvar preferência
        this.saveLanguagePreference();
    }

    // Salvar preferência de idioma
    saveLanguagePreference() {
        try {
            const userDataPath = app.getPath('userData');
            const configPath = path.join(userDataPath, 'config.json');

            let config = {};
            if (fs.existsSync(configPath)) {
                config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }

            config.language = this.currentLanguage;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        } catch (error) {
            console.log('❌ Erro ao salvar preferência de idioma');
        }
    }

    // Carregar preferência de idioma
    loadLanguagePreference() {
        try {
            const userDataPath = app.getPath('userData');
            const configPath = path.join(userDataPath, 'config.json');

            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.language && this.supportedLanguages[config.language]) {
                    this.currentLanguage = config.language;
                    console.log(`📝 Idioma carregado das preferências: ${this.currentLanguage}`);
                }
            }
        } catch (error) {
            console.log('❌ Erro ao carregar preferência de idioma');
        }
    }

    // Mudar idioma
    setLanguage(langCode) {
        if (this.supportedLanguages[langCode]) {
            this.currentLanguage = langCode;
            this.saveLanguagePreference();
            console.log(`🌍 Idioma alterado para: ${langCode} (${this.supportedLanguages[langCode]})`);
            return true;
        }
        return false;
    }

    // Obter tradução
    t(key) {
        const translation = this.translations[this.currentLanguage]?.[key];
        if (!translation) {
            // Fallback para português
            const fallback = this.translations[this.defaultLanguage]?.[key];
            return fallback || key;
        }
        return translation;
    }

    // Obter idioma atual
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Obter idiomas suportados
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// Exportar instância global
const languageManager = new LanguageManager();

module.exports = {
    languageManager,
    t: (key) => languageManager.t(key),
    getCurrentLanguage: () => languageManager.getCurrentLanguage(),
    setLanguage: (lang) => languageManager.setLanguage(lang),
    getSupportedLanguages: () => languageManager.getSupportedLanguages(),
    initializeLanguage: () => languageManager.initialize()
};
