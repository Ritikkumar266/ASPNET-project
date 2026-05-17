# Non-sensitive default values
# Sensitive values (mongodb_connection_string, jwt_secret) should be
# passed via environment variables or CLI:
#   terraform apply -var="mongodb_connection_string=..." -var="jwt_secret=..."
#   OR
#   export TF_VAR_mongodb_connection_string="..."
#   export TF_VAR_jwt_secret="..."

aws_region    = "eu-north-1"
project_name  = "grievance"
environment   = "production"

mongodb_database_name = "aspproject"
jwt_issuer            = "GrievanceApi"
jwt_audience          = "GrievanceApp"
