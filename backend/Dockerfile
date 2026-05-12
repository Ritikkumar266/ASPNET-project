FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["GrievanceApi.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
# Install curl for Docker health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/publish .
# Render sets PORT env var automatically; fallback to 5000 for local Docker
ENV ASPNETCORE_URLS=http://+:${PORT:-5000}
EXPOSE 5000
ENTRYPOINT ["dotnet", "GrievanceApi.dll"]
