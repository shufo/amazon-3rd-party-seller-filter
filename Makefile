# Makefile for zipping Chrome extension

# Extension name (modify this to match your project)
EXTENSION_NAME := $(notdir $(CURDIR))

# Date and time for unique zip filename
DATE := $(shell date +"%Y%m%d_%H%M%S")

# Zip command with exclusions
build:
	@echo "Creating zip archive for Chrome extension..."
	@zip -r $(EXTENSION_NAME)_$(DATE).zip . \
		-x "*.git*" \
		-x "node_modules/*" \
		-x "*.zip" \
		-x "Makefile" \
		-x ".DS_Store" \
		-x "*.log"
	@echo "Zip archive created: $(EXTENSION_NAME)_$(DATE).zip"

# Clean up existing zip files
clean:
	@echo "Removing existing zip archives..."
	@rm -f *.zip
	@echo "Cleanup complete"

# Combine clean and zip
rebuild: clean build

.PHONY: build clean rebuild
