defmodule Api.Orders do
  # import Ecto.Query

  alias Api.Repo
  alias Api.Payment.Check
  alias Api.Orders.Order

  def create_order(raw_attrs \\ %{}) do
    attrs = format_attrs(raw_attrs)

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
    Order.unit_bag_value
    |> Money.new()
    |> Money.multiply(bags)
    |> Money.to_string(separator: ".", delimiter: ",")
  end

  def get_order_value(_bags) do
    "the number of bags should be a positive  number"
  end

  def verify_card(order) do
    case Check.verify(order.card_number) do
      {:ok, _} ->
        order
        |> update_order(%{
          payment_confirmed: true,
          payment_accepted_at: NaiveDateTime.utc_now()
          })
      {:error, _} ->
        {:ok, updated_order} =
          order
          |> update_order(%{
            payment_confirmed: false,
            payment_rejected_at: NaiveDateTime.utc_now()
            })
        {:error, updated_order}
    end
  end

  defp format_attrs(%{}= empty) when map_size(empty) == 0, do: %{}

  defp format_attrs(attrs) do
    value =
      attrs
      |> Map.fetch!("value")
      |> format_value()

    attrs
    |> Map.put("value", value)
  end

  defp format_value("the number of bags should be a positive  number") do
    0
  end

  defp format_value(value) do
    ~r/\D/
    |> Regex.replace(value, "")
    |> String.to_integer()
  end
end
