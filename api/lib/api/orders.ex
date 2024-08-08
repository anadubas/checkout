defmodule Api.Orders do
  # import Ecto.Query

  alias Api.Repo
  alias Api.Payment.Check
  alias Api.Orders.Order

  def create_order(attrs \\ %{}) do
    %Order{}
    |> Order.changeset(attrs)
    |> Repo.insert()
  end

  def update_order(order, attrs) do
    order
    |> Order.changeset(attrs)
    |> Repo.update()
  end

  def get_order_value(bags) when bags > 0 do
    Order.value
    |> Money.new()
    |> Money.multiply(bags)
    |> Money.to_string(separator: ".", delimiter: ",")
  end

  def get_order_value(bags) do
    "#{bags} Should be a positive  number"
  end

  def verify_card(order) do
    case Check.verify(order.card_number) do
      {:ok, _} ->
        order
        |> update_order(%{payment_accepted: true})
      {:error, _} ->
        order
        |> update_order(%{payment_accepted: false})
      end
  end
end
