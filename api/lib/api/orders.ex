defmodule Api.Orders do
  # import Ecto.Query

  alias Api.Repo
  alias Api.Orders.Order

  def create_order(attrs \\ %{}) do
    %Order{}
    |> Order.changeset(attrs)
    |> Repo.insert()
  end

  def get_order_value(bags) when bags > 0 do
    5_90
    |> Money.new()
    |> Money.multiply(bags)
    |> Money.to_string(separator: ".", delimiter: ",")
  end

  def get_order_value(bags) do
    "#{bags} Should be a positive  number"
  end
end
