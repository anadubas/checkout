defmodule ApiWeb.OrderController do
  use ApiWeb, :controller

  action_fallback ApiWeb.FallbackController

  def create(conn, %{"order" => params}) do
    with {:ok, order} <- Orders.create_order(params),
          {:ok, verified_order} <- Orders.verify_card(order) do

      conn
      |> put_status(:created)
      |> render("order.json", order: verified_order)
    end
  end
end
