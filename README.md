# Customer management
CRUD for customer management

## Table of Contents

- [Customer management](#customer-management)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Configuration](#configuration)
  - [Technologies Used](#technologies-used)

## Introduction

A Customer Management System to enable the implementation of basic Create, Read, Update, and Delete (CRUD) operations for effective customer data management. These operations provide a foundation for maintaining accurate and up-to-date customer information within a system.
## Features

- Create, Read, Update, and Delete (CRUD) operations for managing customers.

## Prerequisites

- Node.js and npm installed
- Serverless Framework installed (`npm install -g serverless`)
- AWS CLI configured with necessary permissions

## Getting Started

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create an AWS IAM user with the necessary permissions for your Lambda functions and API Gateway.
2. Configure the AWS CLI with the credentials of the IAM user:

    ```bash
    aws configure
    ```

    Follow the prompts to enter the Access Key ID, Secret Access Key, region, etc.

3. Customize the Serverless Framework configuration:

    Update the `serverless.yml` file with your specific configuration, such as the service name, region, and function settings.

4. Run in order to run the functions offline 
    ```bash
    serverless offline
    ```

## Technologies Used

List the key technologies and frameworks used in your project.

- Node.js
- TypeScript
- Serverless Framework
- AWS Lambda
- AWS API Gateway