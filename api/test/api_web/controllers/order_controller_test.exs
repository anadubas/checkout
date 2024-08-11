defmodule ApiWeb.OrderControllerTest do
	use ApiWeb.ConnCase

  alias Api.Orders

  setup do
    :ok
  end

  describe "POST /orders" do
    @valid_attrs %{
      "customerName" => "John Doe",
      "customerEmail" => "john.doe@example.com",
      "cardNumber" => "1234123412341235",
      "bags" => 5,
      "value" => Orders.get_order_value(5)
    }

    @invalid_attrs %{
      "customerName" => nil,
      "customerEmail" => nil,
      "cardNumber" => nil,
      "bags" => -1,
      "value" => "-1 Should be a positive  number"
    }

    test "creates order and renders order when data is valid", %{conn: conn} do
      conn = post(conn, Routes.order_path(conn, :create, %{"order" => @valid_attrs}))
      response = Jason.decode!(conn.resp_body)

      assert conn.status == 201
      assert response["status"] == 201
      assert response["order"]["customerName"] == "John Doe"
      assert response["order"]["customerEmail"] == "john.doe@example.com"
      assert response["order"]["bags"] == 5
      assert response["order"]["value"] == Orders.get_order_value(5)
      assert response["order"]["cardNumber"] == "1234123412341235"
      assert response["order"]["paymentConfirmed"] == true
    end

    test "returns error when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.order_path(conn, :create, %{"order" => @invalid_attrs}))
      response = Jason.decode!(conn.resp_body)

      assert conn.status == 412
      assert response["status"] == 412
      assert response["error"]["customerName"] == ["can't be blank"]
      assert response["error"]["customerEmail"] == ["can't be blank"]
      assert response["error"]["cardNumber"] == ["can't be blank"]
      assert response["error"]["bags"] == ["must be greater than or equal to 1"]
    end

    test "returns error when card verification fails", %{conn: conn} do
      conn = post(conn, Routes.order_path(conn, :create, %{"order" => Map.put(@valid_attrs, "card_number", "1234123412341234")}))
      response = Jason.decode!(conn.resp_body)

      assert conn.status == 402
      assert response["status"] == 402
      assert response["error"] == "Payment failed"
    end
  end
end
