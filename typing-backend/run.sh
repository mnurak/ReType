#!/bin/bash
~/.venvs/mainenv/bin/python -m uvicorn app.main:app --reload

# use this command when you are in your desired pytohn env or default python is enough

# python -m uvicorn app.main:app --reload
