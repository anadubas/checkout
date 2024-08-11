defmodule Api.Repo.Migrations.AddOrder do
  use Ecto.Migration

  def change do
    create table("orders") do
      add :customer_name, :string, null: false
      add :customer_email, :string, null: false
      add :bags, :integer, null: false, default: 1
      add :value, :integer
      add :card_number, :string, null: false
      add :payment_confirmed, :boolean
      add :payment_accepted_at, :naive_datetime
      add :payment_rejected_at, :naive_datetime

      timestamps()
    end
  end
end
