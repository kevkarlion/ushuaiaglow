'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-surface-darker/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-white leading-[1.1] tracking-tight">
            Políticas de Privacidad
          </h1>
          <p className="text-gray-400 mt-2">
            Última actualización: Abril 2026
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Responsable del Tratamiento</h2>
            <p className="text-gray-300 leading-relaxed">
              Ushuaia, con domicilio en General Roca, Río Negro, Argentina, es responsable del tratamiento de tus datos personales conforme a las disposiciones de la Ley de Protección de Datos Personales (Ley N° 25.326).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Datos Recopilados</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Recopilamos los siguientes datos personales cuando realizás una compra o te contactás con nosotros:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Nombre y apellido</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección de envío y facturación</li>
              <li>Información de pago (procesada por terceros)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Finalidad del Tratamiento</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Tus datos son utilizados exclusivamente para:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Procesar y gestionar tus compras</li>
              <li>Coordinar envíos y entregas</li>
              <li>Comunicarte sobre el estado de tu pedido</li>
              <li>Responder consultas y soporte al cliente</li>
              <li>Enviar información promocional (solo si prestás tu consentimiento)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Protección de Datos</h2>
            <p className="text-gray-300 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tus datos personales contra acceso no autorizado, modificación, divulgación o destrucción indebida. Los datos de pago son procesados directamente por Mercado Pago y nunca se almacenan en nuestros servidores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Tus Derechos</h2>
            <p className="text-gray-300 leading-relaxed">
              Podés ejercer tus derechos de acceso, rectificación, actualización y supresión de tus datos personales contactándonos a través de WhatsApp al +54 9 2984-210435 o por correo electrónico a info@ushuaiaglow.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Uso de Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              Este sitio utiliza cookies para mejorar la experiencia de navegación. Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitás nuestro sitio. Podés configurar tu navegador para rechazar cookies, aunque esto podría afectar algunas funcionalidades del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Compartición de Datos</h2>
            <p className="text-gray-300 leading-relaxed">
              No vendemos, alquilamos ni compartimos tus datos personales con terceros, excepto cuando sea necesario para cumplir con obligaciones legales o para prestar los servicios solicitados (como empresas de correo para envíos).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Contacto</h2>
            <p className="text-gray-300 leading-relaxed">
              Para consultas sobre esta política de privacidad o para ejercer tus derechos, contactanos a través de WhatsApp al +54 9 2984-210435 o por correo electrónico a info@ushuaiaglow.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}