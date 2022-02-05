
   provider "aws" {
      region = "eu-west-2"
    }

   terraform {
     backend "s3" {
       bucket = "tabletop-terraform-backend"
       key = "terraform"
       region = "eu-west-2"
       dynamodb_table = "tabletop-terraform-lock"
     }
   }

   resource "aws_s3_bucket" "tabletop-games-client" {
     bucket = "tabletop-games-client"
     acl = "public-read"
     policy = file("bucketPolicy.json")
     website {
       index_document = "index.html"
       error_document = "index.html"
     }
   }
