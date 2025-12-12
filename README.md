# Clima360

## 🌦️ Clima360

O Clima360 é uma plataforma moderna que integra dados de clima, notícias e alertas inteligentes, utilizando uma arquitetura baseada em microsserviços, filas de mensagens e comunicação assíncrona. O objetivo é fornecer ao usuário informações atualizadas e notificações relevantes de forma rápida, confiável e escalável.

## 📌 Visão Geral

O sistema é dividido em:

- Frontend (React)

- API Gateway

- User Service (Express)

- Weather Service (OpenWeather API)

- News Service (NewsData API)

- Alert Service

- Message Broker (RabbitMQ)

- Notification Service

Cada componente funciona de forma independente, garantindo modularidade e facilidade de manutenção.

## 🧩 Arquitetura do Sistema

## 🚀 Tecnologias Utilizadas
### Frontend

- React

- TailwindCSS 

- React Router

### Backend & Microsserviços

- Node.js

- Express

- JWT para autenticação

- RabbitMQ para mensageria

## Consumo de APIs externas:

- OpenWeather API

- NewsData API

## Comunicação

- HTTP via API Gateway

- Mensageria assíncrona via RabbitMQ
