
import type { DbSchema } from './types';

export const MOCK_DB_NAME = "Données E-commerce (Exemple)";

export const MOCK_SCHEMA: DbSchema = {
  tables: [
    {
      name: "clients",
      columns: [
        { name: "id_client", type: "INTEGER", description: "Identifiant unique du client (clé primaire)" },
        { name: "nom", type: "VARCHAR" },
        { name: "email", type: "VARCHAR" },
        { name: "date_inscription", type: "DATE" },
        { name: "ville", type: "VARCHAR" },
      ],
    },
    {
      name: "commandes",
      columns: [
        { name: "id_commande", type: "INTEGER", description: "Identifiant unique de la commande (clé primaire)" },
        { name: "id_client", type: "INTEGER", description: "Clé étrangère vers clients.id_client" },
        { name: "date_commande", type: "DATE" },
        { name: "montant_total", type: "DECIMAL" },
        { name: "statut", type: "VARCHAR" }, // e.g., 'livrée', 'en attente'
      ],
    },
    {
      name: "produits",
      columns: [
        { name: "id_produit", type: "INTEGER", description: "Identifiant unique du produit (clé primaire)" },
        { name: "nom_produit", type: "VARCHAR" },
        { name: "categorie", type: "VARCHAR" },
        { name: "prix_unitaire", type: "DECIMAL" },
        { name: "stock", type: "INTEGER" },
      ],
    },
    {
      name: "details_commande",
      columns: [
        { name: "id_detail", type: "INTEGER", description: "Identifiant unique du détail (clé primaire)" },
        { name: "id_commande", type: "INTEGER", description: "Clé étrangère vers commandes.id_commande" },
        { name: "id_produit", type: "INTEGER", description: "Clé étrangère vers produits.id_produit" },
        { name: "quantite", type: "INTEGER" },
        { name: "prix_unitaire_vente", type: "DECIMAL" },
      ],
    },
  ],
};
