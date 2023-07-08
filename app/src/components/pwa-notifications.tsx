import { Button, Notification } from "@mantine/core";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { resetUpdate, selectUpdateAvailable } from "../store/pwa";

export function InstallUpdateNotification() {
    const updateAvailable = useAppSelector(selectUpdateAvailable);
    const dispatch = useAppDispatch();

    const onClose = useCallback(() => dispatch(resetUpdate()), [dispatch]);

    const onUpdate = useCallback(async () => {
        dispatch(resetUpdate());

        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        window.location.reload();
    }, [dispatch]);

    return updateAvailable ? (
        <Notification style={{ zIndex: 9999, position: 'fixed', top: "20px", left: "20px" }} title="¡Actualización disponible!" onClose={onClose}>
            Haz click en {" "}
            <Button compact onClick={onUpdate}>
                Actualizar
            </Button>{" "}
            Para obtener la última versión.
        </Notification>
    ) : null;
}