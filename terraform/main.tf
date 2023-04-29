terraform {
  cloud {
    organization = "post-office"

    workspaces {
      name = "wiham-dev"
    }
  }
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

variable "do_region" {
  type    = string
  default = "sfo3"
}

# Database stuff

resource "digitalocean_project" "wiham-project" {
  name        = "where-is-hair-and-makeup"
  description = "Resources for CSCI 4830 final project"
  purpose     = "Web Application"
  environment = "Development"
  resources = [
    digitalocean_database_cluster.whereabouts-db.urn,
    digitalocean_kubernetes_cluster.wiham-cluster.urn
  ]
}

resource "digitalocean_vpc" "whereabouts-vpc" {
  name     = "wiham-vpc"
  region   = var.do_region
  ip_range = "10.10.0.0/16"
}

resource "digitalocean_database_cluster" "whereabouts-db" {
  name                 = "whereabouts-mysql-db"
  engine               = "mysql"
  version              = "8"
  size                 = "db-s-1vcpu-1gb"
  region               = var.do_region
  node_count           = 1
  private_network_uuid = digitalocean_vpc.whereabouts-vpc.id
}

resource "digitalocean_database_db" "whereabouts-db" {
  cluster_id = digitalocean_database_cluster.whereabouts-db.id
  name       = "whereabouts"
}

resource "digitalocean_database_user" "whereabouts-user" {
  cluster_id = digitalocean_database_cluster.whereabouts-db.id
  name       = "flaskuser"
}

# K8s and containers

resource "digitalocean_container_registry" "wiham-registry" {
  name                   = "wiham"
  region                 = var.do_region
  subscription_tier_slug = "basic"
}

resource "digitalocean_kubernetes_cluster" "wiham-cluster" {
  name   = "wiham-cluster"
  region = var.do_region
  # Grab the latest version slug from `doctl kubernetes options versions`
  version              = "1.24.12-do.0"
  registry_integration = true
  vpc_uuid             = digitalocean_vpc.whereabouts-vpc.id

  node_pool {
    name       = "wiham-worker-pool"
    size       = "s-1vcpu-2gb"
    node_count = 1
  }
}
