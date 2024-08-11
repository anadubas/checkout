defmodule ApiWeb.OrderChannelTest do
  use ApiWeb.ChannelCase

  setup do
    {:ok, _, socket} =
      ApiWeb.UserSocket
      |> socket("oder_id", %{})
      |> subscribe_and_join(ApiWeb.OrderChannel, "order:lobby")
    %{socket: socket}
  end

  test "ping replies with status ok", %{socket: socket} do
    ref = push(socket, "ping", %{"hello" => "there"})
    assert_reply ref, :ok, %{"hello" => "there"}
  end

  test "updateBags replies with value and status ok", %{socket: socket} do
    ref = push(socket, "updateBags", 6)
    assert_reply ref, :ok,  %{value: "$35,40"}
  end
end
