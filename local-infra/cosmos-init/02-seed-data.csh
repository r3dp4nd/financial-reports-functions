mkitem -container customers --database=financial-reports '{"id":"CUS-100","customerId":"CUS-100","name":"Olek Customer","documentNumber":"DOC-100","segment":"PREMIUM","email":"customer@example.com"}'

mkitem -container orders --database=financial-reports '{"id":"ORD-100","orderId":"ORD-100","customerId":"CUS-100","orderDate":"2026-08-05T10:00:00.000Z","total":250.00,"currency":"PEN","status":"COMPLETED"}'

mkitem -container orders --database=financial-reports '{"id":"ORD-101","orderId":"ORD-101","customerId":"CUS-100","orderDate":"2026-08-10T14:30:00.000Z","total":450.50,"currency":"PEN","status":"COMPLETED"}'

mkitem -container payments --database=financial-reports '{"id":"PAY-100","paymentId":"PAY-100","customerId":"CUS-100","paymentDate":"2026-08-05T11:00:00.000Z","amount":250.00,"currency":"PEN","status":"SETTLED"}'

mkitem -container payments --database=financial-reports '{"id":"PAY-101","paymentId":"PAY-101","customerId":"CUS-100","paymentDate":"2026-08-10T15:00:00.000Z","amount":450.50,"currency":"PEN","status":"SETTLED"}'
