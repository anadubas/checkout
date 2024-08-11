defmodule Api.Orders.Order do
  @moduledoc """
  Orders schema and changeset
  """

  use Ecto.Schema
  import Ecto.Changeset

  schema "orders" do
    field :customer_name, :string
    field :customer_email, :string
    field :bags, :integer, default: 1
    field :value, Money.Ecto.Amount.Type
    field :card_number, :string
    field :payment_confirmed, :boolean
    field :payment_accepted_at, :naive_datetime
    field :payment_rejected_at, :naive_datetime

    timestamps()
  end

  @required_fields ~w(customer_name customer_email card_number)a
  @fields ~w(bags value payment_confirmed payment_accepted_at payment_rejected_at)a

  @doc """

  """
  def changeset(%__MODULE__{} = order, attrs) do
    order
    |> cast(attrs, @required_fields ++ @fields)
    |> validate_required(@required_fields)
    |> validate_format(:customer_email, ~r/@/)
    |> validate_format(:card_number, ~r/^\d{13,19}$/)
    |> validate_number(:bags, greater_than_or_equal_to: 1)
    |> unique_constraint(:customer_email)
  end

  def unit_bag_value do
    5_90
  end
end
