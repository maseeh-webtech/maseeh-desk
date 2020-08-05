#!/bin/sh

cd "$(dirname "$0")/ansible"
ansible-playbook -i hosts main.yml
