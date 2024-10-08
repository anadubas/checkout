defmodule Api.OrdersTest do
	use Api.DataCase

	alias Api.Orders
  alias Api.Orders.Order

  describe "create_order/1" do
    test "successfully" do
      attrs = %{
        "customer_name" => "John Doe",
        "customer_email" => "john@email.com",
        "card_number" => "1234123412341234",
        "bags" => 5,
        "value" => Orders.get_order_value(5)
      }

      assert {:ok, %Order{} = order} = Orders.create_order(attrs)
      assert order.customer_name == attrs["customer_name"]
      assert order.customer_email == attrs["customer_email"]
      assert order.card_number == attrs["card_number"]
      assert order.bags == attrs["bags"]
    end

    test "validate required fields" do
      assert {:error, %{errors: errors}} = Orders.create_order(%{})
      assert errors[:customer_name] == {"can't be blank", [validation: :required]}
      assert errors[:customer_email] == {"can't be blank", [validation: :required]}
      assert errors[:card_number] == {"can't be blank", [validation: :required]}
    end

    test "validate email format" do
      attrs = %{
        "customer_name" => "John Doe",
        "customer_email" => "johnemail.com",
        "card_number" => "1234123412341234",
        "bags" => 5,
        "value" => Orders.get_order_value(5)
      }

      assert {:error, %{errors: errors}} = Orders.create_order(attrs)
      assert errors[:customer_email] == {"has invalid format", [validation: :format]}
    end

    test "validate card number format" do
      attrs = %{
        "customer_name" => "John Doe",
        "customer_email" => "john@email.com",
        "card_number" => "12341234123",
        "bags" => 5,
        "value" => Orders.get_order_value(5)
      }

      assert {:error, %{errors: errors}} = Orders.create_order(attrs)
      assert errors[:card_number] == {"has invalid format", [validation: :format]}
    end

    test "validate bags number are equal or greater then 1" do
      attrs = %{
        "customer_name" => "John Doe",
        "customer_email" => "john@email.com",
        "card_number" => "1234123412341234",
        "bags" => -5,
        "value" => Orders.get_order_value(5)
      }

      assert {:error, %{errors: errors}} = Orders.create_order(attrs)
      assert errors[:bags] == {"must be greater than or equal to %{number}", [{:validation, :number}, {:kind, :greater_than_or_equal_to}, {:number, 1}]}
    end
  end

  describe "get_order_value/1" do
    test "gets bags value" do
      assert "$23,60" = Orders.get_order_value(4)
    end

    test "notify when number is not positive" do
      assert "the number of bags should be a positive  number" = Orders.get_order_value(-7)
    end
  end

  describe "verify_card/1" do
    test "updates order successufully" do
      order = insert(:order, card_number: "1234123412341235")

      assert {:ok, updated_order} = Orders.verify_card(order)
      assert updated_order.payment_confirmed == true
      refute is_nil(updated_order.payment_accepted_at)
      assert is_nil(updated_order.payment_rejected_at)
      assert is_struct(updated_order.payment_accepted_at, NaiveDateTime)
    end

    test "updates order when error" do
      order = insert(:order, card_number: "1234123412341234")

      assert {:error, updated_order} = Orders.verify_card(order)
      assert updated_order.payment_confirmed == false
      refute is_nil(updated_order.payment_rejected_at)
      assert is_nil(updated_order.payment_accepted_at)
      assert is_struct(updated_order.payment_rejected_at, NaiveDateTime)
    end
  end
end
