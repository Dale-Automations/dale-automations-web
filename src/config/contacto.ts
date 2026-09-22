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

// Guarda el lead antes de abrir WhatsApp.
// Sin esto, si la persona no llega a mandar el mensaje (se arrepiente, no tiene
// WhatsApp Web, cierra la pestaña), el contacto se pierde y nadie se entera.
const WEBHOOK_LEAD = 'https://n8n.daleautomations.com/webhook/lead-sitio';

export const registrarLead = (datos: {
  nombre: string;
  telefono: string;
  idioma?: string;
  origen?: string;
}): void => {
  try {
    fetch(WEBHOOK_LEAD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...datos,
        utm: window.location.search.slice(0, 200),
      }),
      // el envío sobrevive aunque el navegador abra WhatsApp en el acto
      keepalive: true,
    }).catch(() => {});
  } catch {
    // registrar el lead nunca puede impedir que la persona nos escriba
  }
};
