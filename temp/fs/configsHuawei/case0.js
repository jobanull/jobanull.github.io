export const config = `
# ================================
# REMOVE DEFAULT CONFIGURATION
# ================================
system-view
undo dcn
commit

# ================================
# SET HOSTNAME
# ================================
sysname HUAWEI_LAB

# ================================
# INTERFACE CONFIGURATION
# ================================
interface GigabitEthernet0/0/0
 ip address 192.168.1.1 255.255.255.0  
 ip address 192.168.1.1 24 => optional
 undo shutdown

# ================================
# DEFAULT ROUTE
# ================================
ip route-static 0.0.0.0 0.0.0.0 192.168.1.254

# ================================
# USER LOGIN CONFIGURATION
# ================================
aaa
 local-user admin1 password cipher Huawei@123
 local-user admin1 service-type terminal ssh
 local-user admin1 privilege level 15

# ================================
# ENABLE SSH
# ================================
stelnet server enable
ssh user admin1 authentication-type password

# ================================
# VTY (REMOTE ACCESS)
# ================================
user-interface vty 0 4
 authentication-mode aaa
 protocol inbound ssh

# ================================
# NTP CONFIGURATION
# ================================
ntp-service enable
ntp-service unicast-server 8.8.8.8

# ================================
# DNS CONFIGURATION
# ================================
dns resolve
dns server 8.8.8.8

# ================================
# SAVE CONFIGURATION
# ================================
save
`;