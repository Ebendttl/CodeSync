# Security Policy

## 🛡️ Security Overview

CodeSync is designed with security as a core pillar, especially regarding the execution of untrusted code. Our security model focuses on isolation, resource limitation, and network air-gapping.

## 🏗️ Sandboxing Architecture

Untrusted code execution (JavaScript, Python, etc.) is handled by the `runner-service` using Docker containers.

### Isolation Layers
1. **Containerization:** Every execution job runs in a fresh, isolated Docker container.
2. **Restricted User:** Processes inside the container run as a non-privileged `sandbox` user, never as `root`.
3. **Read-Only Filesystem:** The root filesystem is mounted as read-only. Only `/tmp` is writable via `tmpfs` with a small size limit.

### Resource Limits
We enforce strict hardware limits on each container:
- **Memory:** 128MB maximum (no swap).
- **CPU:** 0.5 cores (50% of a single core).
- **PIDs:** Maximum 50 processes to prevent fork bombs.
- **Timeout:** Hard kill after 10 seconds of execution.

### Network Security
- **Air-Gapping:** All sandbox containers are started with `--network none`. They have no access to the local network or the internet, preventing data exfiltration or external API abuse.

## 🐛 Reporting a Vulnerability

If you discover a security vulnerability within CodeSync, please send an email to security@codesync.dev (dummy for now). We will acknowledge your report within 48 hours and provide a timeline for remediation.

Please do not report security vulnerabilities through public GitHub issues.

## 🔒 Responsible Disclosure

We appreciate your help in keeping CodeSync secure. We ask that you:
- Provide a detailed description of the vulnerability.
- Provide steps to reproduce the issue.
- Give us reasonable time to investigate and fix the issue before making it public.

---

Thank you for helping keep CodeSync safe!
