defmodule ApiWeb.OrderChannel do
  use ApiWeb, :channel

  def join("order:lobby", _params, socket) do
    {:ok, socket}
  end

  def terminate(_reason, socket) do
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    {:noreply, socket}
  end

  def handle_in("updateBags", bags_number, socket) do
    result = Orders.get_order_value(bags_number)

    if result =~ ~r/^\$/ do
      {:reply, {:ok, %{value: result}}, socket}
    else
      {:reply, {:error, %{reason: result}}, socket}
    end
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end
end
