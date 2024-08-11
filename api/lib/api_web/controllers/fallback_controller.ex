defmodule ApiWeb.FallbackController do
  use ApiWeb, :controller

  alias Ecto.Changeset
  alias Api.Orders.Order

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> json(%{status: 404, error: "Not found"})
  end

  def call(conn, {:error, %Ecto.Changeset{} =  changeset}) do
    errors = Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)

    conn
    |> put_status(:precondition_failed)
    |> json(%{status: 412, error: Casex.to_camel_case(errors)})
  end

  def call(conn, {:error, %Order{}}) do
    conn
    |> put_status(:payment_required)
    |> json(%{status: 402, error: "Payment failed"})
  end
end
