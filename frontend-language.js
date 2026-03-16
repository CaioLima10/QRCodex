// Sistema de idiomas para frontend
class FrontendLanguageManager {
    constructor() {
        this.currentLanguage = 'pt-BR';
        this.translations = {};
        this.loadTranslations();
    }

    // Carregar traduções do backend
    async loadTranslations() {
        try {
            // Solicitar traduções do processo principal
            const translations = await window.electronAPI.getTranslations();
            this.translations = translations;
            this.currentLanguage = await window.electronAPI.getCurrentLanguage();
            this.updateUI();
        } catch (error) {
            console.error('Erro ao carregar traduções:', error);
            this.loadFallbackTranslations();
        }
    }

    // Carregar traduções fallback
    loadFallbackTranslations() {
        this.translations = {
            'pt-BR': {
                'app_title': 'HoliverQRCode v2.2.1',
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
                sms: 'SMS',
                color: 'Cor',
                size: 'Tamanho',
                style: 'Estilo',
                download: 'Download',
                share: 'Compartilhar',
                history: 'Histórico',
                recent: 'Recentes',
                favorites: 'Favoritos'
            }
        };
        this.updateUI();
    }

    // Atualizar interface com idioma atual
    updateUI() {
        // Atualizar título da página
        document.title = this.t('app_title');

        // Atualizar elementos com data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = this.t(key);
        });

        // Atualizar placeholders
        document.querySelectorAll('[data-placeholder-translate]').forEach(element => {
            const key = element.getAttribute('data-placeholder-translate');
            element.placeholder = this.t(key);
        });

        // Disparar evento de idioma atualizado
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    // Obter tradução
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    // Mudar idioma
    setLanguage(langCode) {
        if (this.translations[langCode]) {
            this.currentLanguage = langCode;
            this.updateUI();

            // Salvar preferência
            localStorage.setItem('preferredLanguage', langCode);

            // Notificar backend
            if (window.electronAPI && window.electronAPI.setLanguage) {
                window.electronAPI.setLanguage(langCode);
            }
        }
    }

    // Obter idioma atual
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Obter idiomas suportados
    getSupportedLanguages() {
        return Object.keys(this.translations);
    }
}

// Inicializar gerenciador de idiomas
const languageManager = new FrontendLanguageManager();

// Função global para tradução
window.t = (key) => languageManager.t(key);

// Exportar para uso global
window.languageManager = languageManager;

// Carregar idiomas quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    languageManager.loadTranslations();
});

// Listener para mudanças de idioma do backend
window.addEventListener('electronLanguageChange', (event) => {
    languageManager.currentLanguage = event.detail.language;
    languageManager.updateUI();
});
