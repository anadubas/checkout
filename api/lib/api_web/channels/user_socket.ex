defmodule ApiWeb.UserSocket do
  use Phoenix.Socket

  channel "order:*", ApiWeb.OrderChannel

  def connect(_params, socket, _connect_info) do
    {:ok, assign(socket, :order_id, Ecto.UUID.generate())}
  end

  def id(_socket), do: nil
end
