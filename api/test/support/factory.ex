defmodule Api.Factory do
  use ExMachina.Ecto, repo: Api.Repo

  alias Api.Orders
  alias Api.Orders.Order

  def order_factory do
    %Order{
      customer_name: "John Doe",
      customer_email: sequence(:email, &"mail#{&1}@email#{&1}.com"),
      bags: 6,
      value: Orders.get_order_value(6),
      card_number: "1234123412341234"
    }
  end
end
