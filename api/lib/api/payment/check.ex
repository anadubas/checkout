defmodule Api.Payment.Check do

  @succeded ["5", "6", "7", "8", "9"]

  def verify(card_number) do
    card_number
    |> String.at(-1)
    |> case do
      last_char when last_char in @succeded -> {:ok, "payment succeeded"}
      _ -> {:error, "payment failed"}
    end
  end
end
