resource "aws_iam_role" "iam_for_github" {
    assume_role_policy    = jsonencode(
        {
            Statement = [
                {
                    Action    = "sts:AssumeRoleWithWebIdentity"
                    Condition = {
                        StringEquals = {
                            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
                        }
                    }
                    Effect    = "Allow"
                    Principal = {
                        Federated = "arn:aws:iam::195663387853:oidc-provider/token.actions.githubusercontent.com"
                    }
                },
            ]
            Version   = "2012-10-17"
        }
    )
    description           = "GitHub role for playground-repo/movies-tv"
    managed_policy_arns   = []
    max_session_duration  = 3600
    name                  = "movies-tv-github"
    path                  = "/"
}

output "iam_for_github" {
  value = aws_iam_role.iam_for_github.arn
}