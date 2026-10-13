import { useState } from 'react';
import Swal from 'sweetalert2';

const Contacto = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos.',
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        confirmButtonColor: 'var(--btn-primary)'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formspreeUrl = "https://formspree.io/f/xppqdlgg"; 

      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al enviar');

      Swal.fire({
        icon: 'success',
        title: '¡Mensaje Enviado!',
        text: 'Hemos recibido tu consulta y te responderemos al correo proporcionado.',
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        confirmButtonColor: 'var(--btn-primary)'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema',
        text: 'No pudimos enviar tu mensaje. Intenta nuevamente más tarde.',
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        confirmButtonColor: 'var(--btn-primary)'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem' }}>
      <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
        <h2 style={{ color: 'var(--text-color)', marginBottom: '1rem', textAlign: 'center' }}>Contáctanos</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
          ¿Tienes alguna duda o consulta? Escríbenos y te responderemos pronto.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name" style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Nombre</label>
            <input 
              type="text" 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="message" style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Mensaje</label>
            <textarea 
              id="message" 
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '1rem', fontSize: '1.1rem', opacity: isSubmitting ? 0.7 : 1 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contacto;
