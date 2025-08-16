# Enterprise Customer Management System

## 🚀 Overview

This is a production-ready, enterprise-grade customer management system built with Next.js 15, TypeScript, Prisma ORM, and Zod validation. The system provides robust customer creation, management, and analytics capabilities with comprehensive error handling and validation.

## ✨ Enterprise Features

### 🔒 Security & Authentication
- Firebase Authentication integration
- Role-based access control (Admin only)
- Request validation and sanitization
- SQL injection protection via Prisma ORM

### 📊 Data Validation
- **Zod Schema Validation**: Enterprise-grade input validation
- **Email Uniqueness**: Prevents duplicate customer emails
- **Field Validation**: Required fields, format validation, length limits
- **Business Rules**: Prevents deletion of customers with orders

### 🎯 Customer Analytics
- **Smart Segmentation**: Automatic customer categorization (New, Developing, Loyal, VIP)
- **Revenue Tracking**: Total spent, average order value calculations
- **Activity Status**: Active/Inactive based on recent order activity
- **Lifecycle Analytics**: Customer journey tracking

### 🛡️ Error Handling
- **Structured Error Responses**: Consistent error format with timestamps
- **HTTP Status Codes**: Proper REST API status codes
- **User-Friendly Messages**: Clear error messages for different scenarios
- **Logging**: Comprehensive error logging for debugging

### ⚡ Performance
- **Database Optimization**: Efficient Prisma queries with proper indexing
- **Pagination**: Built-in pagination for large datasets
- **Search**: Full-text search across customer names and emails
- **Caching**: Optimized database queries

## 🏗️ Architecture

### Backend Services

#### `EnterpriseCustomerService`
Singleton service class providing:
- `createCustomer()` - Create new customer with validation
- `getCustomers()` - Fetch customers with pagination and search
- `getCustomerById()` - Fetch individual customer with stats
- `updateCustomer()` - Update customer information
- `deleteCustomer()` - Delete customer (with business rules)
- `getCustomerStats()` - Calculate comprehensive analytics

#### API Endpoints

##### `POST /api/admin/customers`
Create a new customer
```typescript
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890" // optional
}
```

##### `GET /api/admin/customers`
Fetch customers with query parameters:
- `search`: Search term for name/email
- `limit`: Number of results (1-100)
- `offset`: Pagination offset
- `sortBy`: Sort field (name, email, createdAt)
- `sortOrder`: Sort direction (asc, desc)

##### `GET /api/admin/customers/[id]`
Fetch individual customer with detailed stats

##### `PUT /api/admin/customers/[id]`
Update customer information

##### `DELETE /api/admin/customers/[id]`
Delete customer (blocked if customer has orders)

### Frontend Components

#### Customer Creation Form
- Real-time validation
- User-friendly error messages
- Loading states
- Success feedback

#### Customer Management Dashboard
- Search and filtering
- Bulk operations
- Customer analytics
- Export functionality

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="file:./dev.db"
TURSO_DATABASE_URL="your-turso-url"
TURSO_AUTH_TOKEN="your-turso-token"

# Firebase
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL="your-client-email"
```

### Database Schema
```prisma
model Customer {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders  Order[]
  returns ReturnRequest[]
}
```

## 🧪 Testing

### Automated Testing
Run the comprehensive test suite:
```bash
./test-customer-system.sh
```

### Manual Testing Scenarios

1. **Valid Customer Creation**
   - Fill all required fields
   - Verify success message
   - Check customer appears in list

2. **Validation Testing**
   - Try invalid email formats
   - Leave required fields empty
   - Test duplicate emails

3. **Delete Functionality**
   - Delete customer without orders
   - Try deleting customer with orders
   - Verify proper error messages

## 📈 Performance Metrics

### Response Times (Target)
- Customer Creation: < 500ms
- Customer List (100 items): < 200ms
- Customer Search: < 300ms
- Customer Deletion: < 200ms

### Database Optimization
- Indexed email field for uniqueness
- Optimized queries with selective includes
- Transaction-based operations for data integrity

## 🚨 Error Handling Examples

### Validation Error (400)
```json
{
  "error": "Validation failed: email: Invalid email format",
  "status": 400,
  "timestamp": "2025-08-09T12:00:00.000Z"
}
```

### Duplicate Email (409)
```json
{
  "error": "A customer with this email already exists",
  "status": 409,
  "timestamp": "2025-08-09T12:00:00.000Z"
}
```

### Business Rule Violation (409)
```json
{
  "error": "Cannot delete customer with existing orders. Archive customer instead.",
  "status": 409,
  "timestamp": "2025-08-09T12:00:00.000Z"
}
```

## 🔄 Customer Lifecycle

### Segmentation Logic
- **New**: 0 orders
- **Developing**: 1 order, < $100 spent
- **Loyal**: 2-5 orders, < $500 spent
- **VIP**: 5+ orders OR $500+ spent
- **Inactive**: No orders in 90+ days

### Status Calculation
- **Active**: Order within last 90 days
- **Inactive**: No orders in 90+ days

## 🛠️ Maintenance

### Database Maintenance
```bash
# Update schema
npx prisma db push

# Generate client
npx prisma generate

# Reset database (development only)
npx prisma db reset
```

### Monitoring
- Check error logs regularly
- Monitor API response times
- Track customer creation success rate
- Monitor database performance

## 🔮 Future Enhancements

### Planned Features
- [ ] Customer import/export (CSV, Excel)
- [ ] Advanced search filters
- [ ] Customer communication history
- [ ] Automated customer segmentation rules
- [ ] Customer lifecycle automation
- [ ] Integration with marketing platforms
- [ ] Advanced analytics dashboard
- [ ] Customer satisfaction tracking

### Performance Improvements
- [ ] Redis caching layer
- [ ] Database read replicas
- [ ] GraphQL API for complex queries
- [ ] Real-time updates via WebSockets

## 💼 Enterprise Compliance

### Data Protection
- GDPR compliant data handling
- Customer data encryption
- Audit trail for all operations
- Data retention policies

### Security Standards
- Input sanitization
- SQL injection prevention
- XSS protection
- Rate limiting (planned)

## 📞 Support

For technical support or feature requests, please refer to the development team or create an issue in the project repository.

---

**Built with ❤️ for Enterprise Scale**
