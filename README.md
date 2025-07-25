# 🎓 DOST SA UP Cebu Resources Repository

A resource repository web app for the DOST Scholars' Association of UP Cebu. It includes:

1. 📂 **Requirements Submission & Tracking System** – Scholars submit semesterly DOST requirements, and admins evaluate them.
2. 📰 **Content Management System** – Admins and student-admins manage and publish articles related to DOST SA UP Cebu.

Built using **Next.js** (frontend) and **C#/ASP.NET Core with EF Core** (backend), with file storage handled by **Cloudinary**.

---

## 📦 Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hot Toast](https://react-hot-toast.com/)
- Axios for API calls

### Backend

- [ASP.NET Core Web API](https://dotnet.microsoft.com/en-us/apps/aspnet)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- SQL Server
- [Cloudinary](https://cloudinary.com/) for file hosting (images & PDFs)
- Session-based Authentication

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Loweso/dost-resource-repo.git
cd dost-resource-repo
```

### 2. Setup the backend

```bash
cd project-backend
dotnet restore # Install .NET dependencies
dotnet ef database update # Apply EF Core migrations
```

#### 💡 If dotnet ef is not recognized, install the EF Core CLI tools:

```bash
dotnet tool install --global dotnet-ef
```

#### 🔐 Configure Secrets

```bash
dotnet user-secrets set "Jwt:Key" "your-secret-key"
dotnet user-secrets set "Jwt:Issuer" "project_backend"

dotnet user-secrets set "CloudinarySettings:CloudName" "your-cloud-name"
dotnet user-secrets set "CloudinarySettings:ApiKey" "your-api-key"
dotnet user-secrets set "CloudinarySettings:ApiSecret" "your-api-secret"
```

### 3. Setup the frontend

```bash
cd ../project-frontend
npm install # Install frontend dependencies
```

#### 🔧 Create .env.local

Create a file named .env.local in the root of project-frontend:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 4. Run the app

#### For the backend:

```bash
cd project-backend
dotnet run
```

#### For the frontend:

```bash
cd project-frontend
npm run dev
```
