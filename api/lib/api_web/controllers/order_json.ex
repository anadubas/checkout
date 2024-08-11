defmodule ApiWeb.OrderJSON do
  def render("order.json", %{order: order}) do
    %{
      status: 201,
      order: format_order(order)
    }
  end

  defp format_order(order) do
    %{
      id: order.id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      bags: order.bags,
      value: Money.to_string(order.value, separator: ".", delimiter: ","),
      card_number: order.card_number,
      payment_confirmed: order.payment_confirmed
    }
  end
end
