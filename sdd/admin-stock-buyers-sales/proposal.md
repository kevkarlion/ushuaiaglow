# Proposal: Admin Panel con Stock, Compradores y Compras

## Intent

Completar el ciclo comercial del e-commerce con: gestión de stock desde admin, persistencia de compradores y ventas en MongoDB, descuento automático de stock al confirmaron el pago en MercadoPago, y alertas visuales cuando el stock está bajo.

## Scope

### In Scope
- Panel de stock en `/admin/stock` (ver, agregar, descontar)
- Colección `buyers` en MongoDB (datos del comprador)
- Colección `sales` en MongoDB (registro de compras)
- API `/api/stock` y `/api/stock/[id]`
- API `/api/buyers` (GET/POST)
- API `/api/sales` (GET/POST)
- Webhook `/api/webhook/mercadopago` para procesar pagos
- Actualizar checkout para enviar datos del comprador
- UI alertas de poco stock en admin

### Out of Scope
- Emails de notificación (futuro)
- Exportación a Excel de buyers/sales (futuro)
- Panel de estadísticas (futuro)

## Capabilities

### New Capabilities
- `stock-management`: Gestionar stock desde admin (ver, agregar, descontar manualmente)
- `buyer-database`: Persistir datos de compradores al comprar
- `sale-tracking`: Registrar cada venta con items, total, estado y fecha
- `auto-stock-deduction`: Descontar stock automáticamente al confirmar pago MP
- `low-stock-alerts`: Mostrar advertencia visual cuando stock < 5

### Modified Capabilities
- `checkout`: Enviar datos del comprador a la preferencia MP (actualizar existing spec)

## Approach

1. **Tipos**: Crear `types/buyer.ts` y `types/sale.ts`
2. **Stock API**: GET `/api/stock` (lista productos con stock), PUT `/api/stock/[id]` (update)
3. **Buyers API**: GET/POST `/api/buyers`
4. **Sales API**: GET/POST `/api/sales`
5. **Webhook**: `POST /api/webhook/mercadopago` - recibir notificación MP, guardar buyer/sale, descontar stock
6. **Checkout**: Actualizar para enviar buyer data en preferencia MP
7. **UI Admin**: Nuevas páginas stock, buyers, sales + alertas

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `types/product.ts` | Modified | Ya existe con campo `stock` |
| `types/buyer.ts` | New | Interface Buyer |
| `types/sale.ts` | New | Interface Sale |
| `app/api/stock/route.ts` | New | GET stock de productos |
| `app/api/stock/[id]/route.ts` | New | PUT actualizar stock |
| `app/api/buyers/route.ts` | New | GET/POST buyers |
| `app/api/sales/route.ts` | New | GET/POST sales |
| `app/api/webhook/mercadopago/route.ts` | New | Webhook para procesar pagos |
| `app/api/checkout/route.ts` | Modified | Enviar datos buyer a MP |
| `app/admin/page.tsx` | Modified | Agregar navegación a nuevas secciones |
| `app/admin/stock/page.tsx` | New | Panel gestión stock |
| `app/admin/buyers/page.tsx` | New | Lista compradores |
| `app/admin/sales/page.tsx` | New | Historial ventas |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Webhook no recibe notificación (MP no config) | Medium | Implementar `/api/checkout/verify` para verificar estado manualmente |
| Race condition al descontar stock | Low | Usar atomic `inc` en MongoDB |
| Datos de buyer incompletos | Low | Validar campos requeridos en checkout |

## Rollback Plan

1. Eliminar las nuevas colecciones: `db.buyers.drop()`, `db.sales.drop()`
2. Eliminar nuevas APIs y páginas
3. Revertir checkout a versión anterior
4. El stock manuales se mantiene (no hay operaciones destructivas)

## Dependencies

- MongoDB ya conectada (`MONGODB_URI`)
- MercadoPago ya integrado (`MP_ACCESS_TOKEN`)
- Next.js 14 App Router

## Success Criteria

- [ ] Stock visible y editable desde `/admin/stock`
- [ ] Buyers persistidos al completar compra
- [ ] Sales visibles en `/admin/sales` con items y estado
- [ ] Stock descontado automáticamente al aprobarse pago
- [ ] Alerta visible en admin cuando stock < 5
- [ ] Flujo completo de checkout funcionando end-to-end