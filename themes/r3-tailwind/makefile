#  Prefer long args to short args for readability
ROOT_DIR    := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
DOCKER       = docker
HUGO_VERSION = 0.79.0
DOCKER_IMAGE = corda-docs-theme
DOCKER_RUN   = $(DOCKER) run --rm --interactive --tty --volume $(ROOT_DIR):/src

THEME_ROOT_DIR    := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
SITE_DIR          := $(realpath $(THEME_ROOT_DIR)/../..)

# DOCKER_RUN   = $(DOCKER) run --rm --interactive --tty --volume $(CURDIR):/src

.PHONY: all build help watch


help: ## Show this help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# build: ## Build the theme.
# 	yarn run build

# watch: ## Dev build of theme, then watch sources.
# 	yarn run build-dev --watch

# docker-clean: ## Remove docker image.
# 	$(DOCKER) rmi $(DOCKER_IMAGE)

# docker-image: ## Build docker image for theme.
# 	$(DOCKER) build . --tag $(DOCKER_IMAGE) --build-arg HUGO_VERSION=$(HUGO_VERSION)

# docker-build: ## Run docker to build the theme assets.
# 	$(DOCKER_RUN) -u $(id -u ${USER}):$(id -g ${USER}) $(DOCKER_IMAGE) yarn run build

# docker-build-watch: ## Run docker dev build for the theme assets and then watch.
# 	$(DOCKER_RUN) -u $(id -u ${USER}):$(id -g ${USER}) $(DOCKER_IMAGE) yarn run build-dev --watch

all: help
	echo ""

clean: ## Remove node_modules
	rm -rf $(ROOT_DIR)/node_modules

########################################################################################################################
#  If you're in a "site" project, this "install" the theme into your site.
#  Hugo pipes seems to want both tailwind, and node modules at the root level in order to build them correctly.
#
#  If you edit the JAVASCRIPT in this theme and you're running hugo serve,
#  you'll likely have to re-run `make install` periodically.
########################################################################################################################

copy-theme-files: ## Copy theme files
	cp $(THEME_ROOT_DIR)/package.json $(SITE_DIR)
	cp $(THEME_ROOT_DIR)/package-lock.json $(SITE_DIR)
	cp $(THEME_ROOT_DIR)/tailwind.config.js $(SITE_DIR)
	cp $(THEME_ROOT_DIR)/postcss.config.js $(SITE_DIR)

run-npm: ## Run npm in the main hugo folder
	cd $(SITE_DIR)
	npm install

install: copy-theme-files run-npm  ## Install theme
	echo "Copied files and ran npm install in" $(SITE_DIR)

site-prod-serve: install ## Serve a prod version of the site
	cd $(SITE_DIR)
	export NODE_ENV=production
	hugo -e production serve --minify

site-prod: install ## Build prod version of the site
	cd $(SITE_DIR)
	export NODE_ENV=production
	hugo -e production --minify

site-dev-serve: install
	cd $(SITE_DIR)
	hugo serve

# hugo serve -D -F --disableFastRender
