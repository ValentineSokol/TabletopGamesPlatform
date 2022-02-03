
   provider "aws" {
      region = "eu-west-2"
      access_key = "AKIA525FNXQXF772QIWX"
      secret_key = "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"
    }

   resource "aws_s3_bucket" "tabletop_games" {
     ami = "ami-0015a39e4b7c0966f"
     instance_type = "t3.micro"
   }