/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { UserStore, VoiceStateStore } from "@webpack/common";

const settings = definePluginSettings({
    hassApiKey: {
        description: "Home Assistant API Key",
        type: OptionType.STRING,
        default: "Test"
    },
});

async function callHassApi(endpoint: string, body: string) {
    const response = await fetch(endpoint, {
        method: "POST",
        body,
        headers: {
            "Content-Type": "application/json",
            "Authorization": settings.store.hassApiKey,
        }
    });
}

export default definePlugin({
    name: "HomeAssistantMQTT",
    description: "Publish Discord states via MQTT discovery to Home Assistant",
    authors: [{ name: "techtoto", id: 705008648849457232n }],
    settings,

    flux: {
        VOICE_STATE_UPDATES() {
            const myId = UserStore.getCurrentUser().id;
            const myVoiceState = VoiceStateStore.getVoiceStateForUser(myId);

            if (myVoiceState) {
                callHassApi("https://home.wg.techtoto.dev/api/services/input_boolean/turn_on",
                    "{ \"entity_id\": \"input_boolean.tobi_discord_in_voice_channel\"}");
            } else {
                callHassApi("https://home.wg.techtoto.dev/api/services/input_boolean/turn_off",
                    "{ \"entity_id\": \"input_boolean.tobi_discord_in_voice_channel\"}");
            }
        }
    }
});
