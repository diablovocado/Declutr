package application

import (
	"context"
	"fmt"
	"runtime/debug"
	"time"

	"github.com/diablovocado/declutr/modules/extension/domain"
)

// SandboxConfig defines resource quota boundaries.
type SandboxConfig struct {
	MaxExecutionTimeout time.Duration
	MaxMemoryMB         int
	MaxCPUTime          time.Duration
}

// ExtensionSandbox provides an isolated runtime boundary for extension invocation.
type ExtensionSandbox struct {
	config SandboxConfig
}

func NewExtensionSandbox(cfg SandboxConfig) *ExtensionSandbox {
	if cfg.MaxExecutionTimeout == 0 {
		cfg.MaxExecutionTimeout = 5 * time.Second
	}
	if cfg.MaxMemoryMB == 0 {
		cfg.MaxMemoryMB = 128
	}
	return &ExtensionSandbox{config: cfg}
}

// ExecuteSandbox runs extension code safely inside isolated panic recovery and timeout context.
func (sb *ExtensionSandbox) ExecuteSandbox(
	ctx context.Context,
	inst *domain.ExtensionInstallation,
	requiredPerm string,
	fn func(ctx context.Context) (interface{}, error),
) (result interface{}, err error) {
	// 1. Permission Enforcement Check
	if requiredPerm != "" {
		hasPerm := false
		for _, p := range inst.ApprovedPermissions {
			if p == requiredPerm || p == domain.PermAdminManage {
				hasPerm = true
				break
			}
		}
		if !hasPerm {
			return nil, fmt.Errorf("sandbox violation: extension lacks approved permission %s", requiredPerm)
		}
	}

	// 2. Status Check
	if inst.Status != domain.StatusEnabled && inst.Status != domain.StatusInstalled {
		return nil, fmt.Errorf("sandbox restriction: extension is in state %s", inst.Status)
	}

	// 3. Timeout Context
	timeoutCtx, cancel := context.WithTimeout(ctx, sb.config.MaxExecutionTimeout)
	defer cancel()

	resChan := make(chan interface{}, 1)
	errChan := make(chan error, 1)

	go func() {
		// Panic Recovery (Crash Isolation)
		defer func() {
			if r := recover(); r != nil {
				stack := string(debug.Stack())
				errChan <- fmt.Errorf("sandbox crash recovered: %v\nStack: %s", r, stack)
			}
		}()

		val, execErr := fn(timeoutCtx)
		if execErr != nil {
			errChan <- execErr
		} else {
			resChan <- val
		}
	}()

	select {
	case <-timeoutCtx.Done():
		return nil, fmt.Errorf("sandbox timeout: execution exceeded limit of %v", sb.config.MaxExecutionTimeout)
	case err := <-errChan:
		return nil, err
	case res := <-resChan:
		return res, nil
	}
}
