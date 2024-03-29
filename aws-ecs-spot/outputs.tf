output "cli"  {
    value = {
        step-1 = "aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${var.account-id}.dkr.ecr.${var.region}.amazonaws.com"
        step-2 = "docker build . -t nextjs-spotify-public:latest -t ${aws_ecr_repository.testing.repository_url}:latest"
        step-3 = "docker tag nextjs-spotify-public:latest ${aws_ecr_repository.testing.repository_url}:latest"
        step-5 = "docker push ${var.account-id}.dkr.ecr.${var.region}.amazonaws.com/${var.name}:latest"
    }
}

resource "local_file" "build-sh" {
  filename = "build.sh"
  content  = <<EOT
aws ecr get-login-password --region ${var.region} | sudo docker login --username AWS --password-stdin ${var.account-id}.dkr.ecr.${var.region}.amazonaws.com
sudo docker build . -t nextjs-spotify-public:latest -t ${aws_ecr_repository.testing.repository_url}:latest --build-arg CACHE=1
# sudo docker tag nextjs-spotify-public:latest ${aws_ecr_repository.testing.repository_url}:latest
sudo docker push ${var.account-id}.dkr.ecr.${var.region}.amazonaws.com/${var.name}:latest
  EOT
}