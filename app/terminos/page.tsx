'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-surface-darker/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-white leading-[1.1] tracking-tight">
            Términos y Condiciones
          </h1>
          <p className="text-gray-400 mt-2">
            Última actualización: Abril 2026
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Información General</h2>
            <p className="text-gray-300 leading-relaxed">
              Ushuaia, con domicilio en General Roca, Río Negro, Argentina, es responsable de la venta y distribución de productos de cuidado personal. Al utilizar este sitio web, aceptás los siguientes términos y condiciones en su totalidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Productos y Precios</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Todos los precios están expresados en pesos argentinos (ARS) e incluyen IVA.</li>
              <li>Los precios pueden ser modificados sin previo aviso.</li>
              <li>Las fotografías son referenciales y pueden variar respecto al producto final.</li>
              <li>Nos reservamos el derecho de limitar las cantidades disponibles.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Envíos y Entregas</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Realizamos envíos a todo el país a través de servicios de correo.</li>
              <li>Los plazos de entrega son estimados y pueden variar según la zona.</li>
              <li>El costo de envío se calcula al momento de la compra.</li>
              <li>Una vez despachado el pedido, recibirás un código de seguimiento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Política de Devoluciones</h2>
            <p className="text-gray-300 leading-relaxed">
              Aceptamos devoluciones dentro de los 10 días corridos desde la recepción del producto, siempre que el mismo se encuentre en su packaging original y sin usar. Los costos de envío por devolución corren por cuenta del comprador. Para iniciar un proceso de devolución, contactanos a través de nuestro canal de WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Métodos de Pago</h2>
            <p className="text-gray-300 leading-relaxed">
              Aceptamos pagos mediante transferencia bancaria, Mercado Pago y otros medios que se indiquen en el checkout. Todos los pagos están sujetos a confirmación por parte de la plataforma de pago utilizada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Protección de Datos</h2>
            <p className="text-gray-300 leading-relaxed">
              Tus datos personales serán tratados conforme a nuestra Política de Privacidad. Al realizar una compra, aceptas que tus datos sean almacenados y procesados únicamente para fines comerciales y de comunicación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Contacto</h2>
            <p className="text-gray-300 leading-relaxed">
              Para cualquier consulta sobre estos términos, podés contactarnos a través de WhatsApp al +54 9 2984-210435 o por correo electrónico a info@ushuaiaglow.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Modificaciones</h2>
            <p className="text-gray-300 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en este sitio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}