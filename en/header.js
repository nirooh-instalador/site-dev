class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="footer-inner">
                <div class="footer-brand-block">
                    <a class="brand" href="#inicio"><img class="brand-logo" src="/assets/logo-nirooh-grey.png" alt="Nirooh" /></a>
                    <p>© 2026 Nirooh. Unbox the Programmatic DOOH</p>
                </div>
                <div class="footer-links">
                    <a href="#artigos">Artigos</a>
                    <a href="/termos/politica-de-privacidade.html">Política de Privacidade</a>
                    <a href="mailto:suporte@nirooh.com.br">Suporte</a>
                    <a href="https://cms.nirooh.com/login" target="_blank">Login</a>
                    <a href="https://api.whatsapp.com/send/?phone=%2B5519997455263&amp;text&amp;type=phone_number&amp;app_absent=0">WhatsApp</a>
                </div>
                <div class="footer-social" aria-label="Siga-nos">
                    <span class="footer-social-label">Siga-nos</span>
                    <a href="https://www.youtube.com/@Nirooh_pdooh" aria-label="YouTube" title="YouTube"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/></svg></a>
                    <a href="https://www.linkedin.com/company/nirooh" aria-label="LinkedIn" title="LinkedIn"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.31 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.53V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z"/></svg></a>
                    <a href="https://instagram.com/niroohbr" aria-label="Instagram" title="Instagram"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 0h9.6A7.2 7.2 0 0 1 24 7.2v9.6a7.2 7.2 0 0 1-7.2 7.2H7.2A7.2 7.2 0 0 1 0 16.8V7.2A7.2 7.2 0 0 1 7.2 0Zm0 2.4a4.8 4.8 0 0 0-4.8 4.8v9.6a4.8 4.8 0 0 0 4.8 4.8h9.6a4.8 4.8 0 0 0 4.8-4.8V7.2a4.8 4.8 0 0 0-4.8-4.8H7.2Zm4.8 4a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Zm0 2.4a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.88-2.64a1.32 1.32 0 1 1 0 2.64 1.32 1.32 0 0 1 0-2.64Z"/></svg></a>
                </div>
                </div>
            </footer>
            <a class="whatsapp-button" href="https://api.whatsapp.com/send/?phone=%2B5519997455263&amp;text&amp;type=phone_number&amp;app_absent=0" aria-label="Falar com a Nirooh no WhatsApp" title="WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.58 0 .27 5.3.27 11.82c0 2.08.54 4.12 1.58 5.92L.17 24l6.4-1.68a11.8 11.8 0 0 0 5.53 1.4h.01c6.52 0 11.83-5.3 11.83-11.82 0-3.16-1.23-6.13-3.42-8.42ZM12.1 21.72a9.8 9.8 0 0 1-5-1.37l-.36-.22-3.8 1 1.01-3.7-.24-.38a9.78 9.78 0 0 1-1.5-5.23c0-5.42 4.42-9.83 9.86-9.83 2.63 0 5.1 1.03 6.96 2.89a9.77 9.77 0 0 1 2.9 6.94c0 5.43-4.42 9.84-9.84 9.84Zm5.4-7.36c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47a8.9 8.9 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.48.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"/></svg>
            </a>
        `;
    }
}

customElements.define('footer-main', Footer)