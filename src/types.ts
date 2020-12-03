/*
All of these are educated guesses.
I mapped everything that was `null` and none-obvious to `any`
If you figure any of these out Pull Requests are highly appreciated
*/

export type Account = {
  name: string
  phone: {
    value: string
    country_code: string
    national_number: string
    verified: boolean
  }
  email: {
    value: string
    verified: boolean
  }
  log_id: string
  organization_id: any
  image_assets: any
  networks: {
    count: 1
    data: [
      {
        url: string
        name: string
        created: string
        access_expires_on: any
        amazon_directed_id: string
      },
    ]
  }
  auth: {
    type: string
    provider_id: any
    service_id: any
  }
  role: string
  can_transfer: boolean
  is_premium_capable: boolean
  payment_failed: boolean
  premium_status: string
  premium_details: {
    trial_ends: any
    has_payment_info: boolean
    tier: string
  }
  push_settings: {
    networkOffline: boolean
    nodeOffline: boolean
  }
  trust_certificates_etag: string
  consents: {
    marketing_emails: {
      consented: boolean
    }
  }
}

export type Device = {
  url: string
  mac: string
  eui64: string
  manufacturer: string | null
  ip: string | null
  ips: string[]
  nickname: string | null
  hostname: string | null
  connected: boolean
  wireless: boolean
  connection_type: string
  source: {
    location: string
  }
  last_active: string
  first_active: string
  connectivity: {
    rx_bitrate: string
    signal: string
    signal_avg: any
    score: number
    score_bars: number
  }
  interface: {
    frequency: string
    frequency_unit: string
  }
  usage: any
  profile: any
  device_type: string
  blacklisted: boolean
  homekit: {
    registered: boolean
    protection_mode: string
  }
  is_guest: boolean
  paused: boolean
  channel: any
  auth: string
  is_private: boolean
}

export type Network = {
  url: string
  resources: {
    [key: string]: string
  }
  capabilities: {
    [key: string]: {
      capable: boolean
      capable_with_user_remediations?: boolean
      requirements: {
        [key: string]: boolean
      }
    }
  }
  flags: {
    flag: string
    value: any
  }[]
  name: string
  password: string
  status: string
  messages: []
  gateway: string
  wan_ip: any
  geo_ip: {
    countryCode: string
    countryName: string
    city: string
    region: string
    timezone: string
    postalCode: string
    metroCode: any
    areaCode: any
    regionName: string
    isp: string
    org: string
  }
  gateway_ip: any
  connection: {
    mode: string
  }
  lease: {
    mode: string
    dhcp: {
      ip: string
      mask: string
      router: string
    }
    static: any
  }
  dhcp: {
    mode: string
    custom: {
      subnet_ip: string
      subnet_mask: string
      start_ip: string
      end_ip: string
    }
  }
  dns: {
    mode: string
    parent: {
      ips: [string]
    }
    custom: {
      ips: string[]
    }
    caching: false
  }
  upnp: false
  ipv6_upstream: boolean
  thread: false
  sqm: boolean
  band_steering: boolean
  wpa3: boolean
  eeros: {
    count: number
    data: EeroHotspot[]
  }
  clients: {
    count: 38
    url: string
  }
  speed: {
    status: string
    date: string
    up: {
      value: 41.81552
      units: string
    }
    down: {
      value: 104.23904
      units: string
    }
  }
  timezone: {
    value: string
    geo_ip: string
  }
  updates: {
    min_required_firmware: string
    target_firmware: string
    update_to_firmware: string
    update_required: false
    can_update_now: false
    has_update: false
    update_status: any
    last_update_started: string
    last_user_update: {
      last_update_started: string
      unresponsive_eeros: []
      incomplete_eeros: []
    }
    manifest_resource: string
  }
  health: {
    internet: {
      status: string
      isp_up: boolean
    }
    eero_network: {
      status: string
    }
  }
  upstream: []
  ip_settings: {
    double_nat: false
    public_ip: string
  }
  premium_dns: {
    dns_policies_enabled: false
    zscaler_location_enabled: false
    any_policies_enabled_for_network: false
    dns_provider: any
    dns_policies: {
      block_malware: false
      ad_block: false
    }
    advanced_content_filters: any
  }
  owner: string
  premium_status: string
  rebooting: any
  last_reboot: string
  homekit: any
  ipv6_lease: any
  ipv6: {
    name_servers: {
      mode: string
      custom: []
    }
  }
  organization: any
  image_assets: any
  access_expires_on: any
  guest_network: {
    url: string
    resources: {
      password: string
    }
    name: string
    password: string
    enabled: false
  }
  amazon_account_linked: boolean
  amazon_directed_id: string
  amazon_full_name: string
  ffs: boolean
  temporary_flags: {}
  alexa_skill: false
  amazon_device_nickname: false
}

export type EeroHotspot = {
  url: string
  resources: {
    led_action: string
    reboot: string
  }
  serial: string
  network: {
    url: string
    name: string
    created: string
  }
  location: string
  joined: string
  gateway: boolean
  ip_address: string
  status: string
  messages: any[]
  model: string
  model_number: string
  ethernet_addresses: string[]
  wifi_bssids: string[]
  update_available: boolean
  os: string
  os_version: string
  mesh_quality_bars: number
  wired: boolean
  led_on: boolean
  using_wan: boolean
  nightlight: any
  last_reboot: any
  mac_address: string
  ipv6_addresses: [
    {
      address: string
      scope: string
      interface: string
    },
    {
      address: string
      scope: string
      interface: string
    },
  ]
  organization: any
  connected_clients_count: number
  requires_amazon_pre_authorized_code: boolean
  heartbeat_ok: boolean
  last_heartbeat: string
}
