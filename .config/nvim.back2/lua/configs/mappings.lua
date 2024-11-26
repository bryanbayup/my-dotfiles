local map = vim.api.nvim_set_keymap
local opts = { noremap = true, silent = true }

-- Leader key
vim.g.mapleader = ' '

-- Save with Ctrl+s
map('n', '<C-s>', ':w<CR>', opts)
map('i', '<C-s>', '<ESC>:w<CR>a', opts)

-- Navigate splits
map('n', '<C-h>', '<C-w>h', opts)
map('n', '<C-j>', '<C-w>j', opts)
map('n', '<C-k>', '<C-w>k', opts)
map('n', '<C-l>', '<C-w>l', opts)

-- File explorer
map('n', '<leader>e', ':NvimTreeToggle<CR>', opts)

-- Telescope
map('n', '<leader>ff', ':Telescope find_files<CR>', opts)
map('n', '<leader>fg', ':Telescope live_grep<CR>', opts)

-- ToggleTerm
map('n', '<leader>tt', ':ToggleTerm<CR>', opts)

--RunCode
map('n', '<leader>r', ':RunCode<CR>', { noremap = true, silent = true })
map('n', '<leader>rf', ':RunFile<CR>', { noremap = true, silent = true })
map('n', '<leader>rft', ':RunFile tab<CR>', { noremap = true, silent = true })
map('n', '<leader>rp', ':RunProject<CR>', { noremap = true, silent = true })
map('n', '<leader>rc', ':RunClose<CR>', { noremap = true, silent = true })
map('n', '<leader>crf', ':CRFiletype<CR>', { noremap = true, silent = true })
map('n', '<leader>crp', ':CRProjects<CR>', { noremap = true, silent = true })

-- Mapping untuk menutup toggleterm jika terbuka
map('t', '<Esc>', '<C-\\><C-n>:ToggleTerm<CR>', { noremap = true, silent = true })

-- Molten Keymaps
vim.keymap.set("n", "<leader>e", ":MoltenEvaluateOperator<CR>", { desc = "evaluate operator", silent = true })
vim.keymap.set("n", "<leader>os", ":noautocmd MoltenEnterOutput<CR>", { desc = "open output window", silent = true })
vim.keymap.set("n", "<leader>rr", ":MoltenReevaluateCell<CR>", { desc = "re-eval cell", silent = true })
vim.keymap.set("v", "<leader>r", ":<C-u>MoltenEvaluateVisual<CR>gv", { desc = "execute visual selection", silent = true })
vim.keymap.set("n", "<leader>oh", ":MoltenHideOutput<CR>", { desc = "close output window", silent = true })
vim.keymap.set("n", "<leader>md", ":MoltenDelete<CR>", { desc = "delete Molten cell", silent = true })
vim.keymap.set("n", "<leader>mx", ":MoltenOpenInBrowser<CR>", { desc = "open output in browser", silent = true })

