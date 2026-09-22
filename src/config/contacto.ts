// Único lugar donde viven los WhatsApp del sitio.
// Si hay que cambiar un número, se cambia acá y no en cada componente.

// Español: lo atiende el bot automático (workflow n8n "Dale - Bot WhatsApp").
// Responde consultas y le avisa a Pablo por Telegram cuando el lead está para cerrar.
export const WHATSAPP_ES = '5491162325568';

// Inglés: sigue atendido por una persona (Houston).
export const WHATSAPP_EN = '13464929025';

export const whatsappNumero = (lang?: string): string =>
  lang === 'en' ? WHATSAPP_EN : WHATSAPP_ES;

// Mensaje con el que arranca el chat. En español ya no nombra a Pablo,
// porque del otro lado contesta el asistente.
export const whatsappSaludo = (lang?: string): string =>
  lang === 'en'
    ? 'Hey Pablo! I found you on daleautomations.com'
    : 'Hola! Los encontré por daleautomations.com';

export const abrirWhatsApp = (lang?: string, mensaje?: string): void => {
  const texto = mensaje || whatsappSaludo(lang);
  window.open(
    `https://wa.me/${whatsappNumero(lang)}?text=${encodeURIComponent(texto)}`,
    '_blank'
  );
};
