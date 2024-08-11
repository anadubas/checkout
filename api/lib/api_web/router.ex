defmodule ApiWeb.Router do
  use ApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug Casex.CamelCaseDecoderPlug
  end

  scope "/api", ApiWeb do
    pipe_through :api

    post "/orders", OrderController, :create
  end
end
