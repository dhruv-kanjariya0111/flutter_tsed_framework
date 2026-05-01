#!/bin/bash
# Quick start for a new feature.
FEATURE_NAME=${1:-"my-feature"}
echo "Starting new feature: $FEATURE_NAME"
echo ""
echo "Recommended workflow:"
echo "  1. /api-design \"$FEATURE_NAME\""
echo "  2. /plan \"$FEATURE_NAME\""
echo "  3. /tdd \"$FEATURE_NAME\""
echo "  4. /tdd-backend \"$FEATURE_NAME\""
echo "  5. /sync-contract"
echo "  6. /verify"
echo "  7. /review \"$FEATURE_NAME\""
