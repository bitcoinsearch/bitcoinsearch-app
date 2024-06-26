code-check:
	yarn lint
	yarn prettier:check

code-fix:
	yarn lint:fix
	yarn prettier:fix