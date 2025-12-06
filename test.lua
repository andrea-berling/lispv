-- 1. Verifica che ci siano client LSP attivi
local clients = vim.lsp.get_clients({ bufnr = 0 })
print("=== LSP Clients attivi ===")
for _, client in ipairs(clients) do
  print(string.format("Client: %s (id: %d)", client.name, client.id))
  print(string.format("  Hover support: %s", vim.inspect(client.server_capabilities.hoverProvider)))
end

-- 2. Verifica il keybinding per K
print("\n=== Keybinding per K ===")
local key_maps = vim.api.nvim_buf_get_keymap(0, 'n')
for _, map in ipairs(key_maps) do
  if map.lhs == 'K' then
    print(string.format("K mappato a: %s", vim.inspect(map)))
  end
end

-- 3. Prova manualmente hover
print("\n=== Test manuale hover ===")
print("Esecuzione vim.lsp.buf.hover()...")
vim.lsp.buf.hover()

-- 4. Verifica la posizione del cursore
local pos = vim.api.nvim_win_get_cursor(0)
print(string.format("\nPosizione cursore: linea %d, colonna %d", pos[1], pos[2]))

-- 5. Verifica il filetype
print(string.format("Filetype: %s", vim.bo.filetype))
